import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import { EntityManager, Repository } from "typeorm";
import { Url } from "./entities/url.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { generateShortCode } from "src/utils/helpers";
import { Email } from "./entities/email.entity";
import { Click } from "./entities/click.entity";
import { Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import * as geoip from "geoip-lite";

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    @InjectRepository(Click)
    private readonly clickRepository: Repository<Click>,
    private readonly entityManager: EntityManager,
  ) {}

  async createMail(url: Url, email: string, manager: EntityManager) {
    let emailEntity = await manager.findOne(Email, {
      where: { email },
    });

    if (!emailEntity) {
      emailEntity = manager.create(Email, { email, url: [url] });
      await manager.save(emailEntity);
      return;
    }

    const alreadyLinked = await manager
      .createQueryBuilder()
      .select("1")
      .from("url_emails_email", "ue")
      .where("ue.emailId = :emailId AND ue.urlId = :urlId", {
        emailId: emailEntity.id,
        urlId: url.id,
      })
      .getRawOne();

    if (alreadyLinked) return;

    emailEntity.url = [url];
    await manager
      .createQueryBuilder()
      .relation(Email, "url")
      .of(emailEntity)
      .add(url);
  }

  async create(createUrlDto: CreateUrlDto) {
    return this.entityManager.transaction(async (manager: EntityManager) => {
      let customCode = createUrlDto.customCode;
      const email = createUrlDto.email;

      if (!customCode) customCode = generateShortCode(createUrlDto.destination);

      const exists = await manager.findOne(Url, {
        where: { customCode },
      });

      if (exists) {
        if (email) await this.createMail(exists, email, manager);
        return exists;
      }

      const url = manager.create(Url, { ...createUrlDto, customCode });
      await manager.save(url);

      if (email) await this.createMail(url, email, manager);

      return url;
    });
  }

  async checkCode(customCode: string) {
    const codeExists = await this.urlRepository.findOne({
      where: { customCode },
    });

    return { data: !!codeExists };
  }

  async findAll(email: string) {
    const urls = await this.emailRepository.find({
      where: { email },
      relations: { url: true },
    });
    return urls;
  }

  async findOne(id: string, email: string) {
    const url = await this.urlRepository.findOne({
      where: { customCode: id },
      relations: { clicks: true },
    });

    if (!url) throw new NotFoundException(["Url not found"]);

    const isAdminEmail = await this.emailRepository.findOne({
      where: {
        url: { customCode: id },
        email,
      },
      relations: { url: true },
    });

    if (!isAdminEmail)
      throw new UnauthorizedException([
        "This email is not an admin of this URL",
      ]);

    return url;
  }

  async go2(customCode: string, res: Response, req: Request) {
    const url = await this.urlRepository.findOne({ where: { customCode } });

    if (!url) throw new NotFoundException(["Url not found"]);

    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();

    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      "";
    const geo = geoip.lookup(ip);

    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const cityGeo = await geoRes.json();

    const click = this.clickRepository.create({
      url,
      os: ua.os.name ?? "",
      device: ua.device.type ?? "desktop",
      country: geo?.country ?? "",
      city: geo?.city ?? cityGeo?.city ?? "",
    });
    await this.clickRepository.save(click);

    res.redirect(url.destination);

    return url;
  }

  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
