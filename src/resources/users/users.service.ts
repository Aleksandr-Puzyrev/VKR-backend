import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./users.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "src/resources/roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { Op } from "sequelize";
import { FindWithPaginationQueryDto } from "./dto/find-with-pagination-query.dto";
import { Course } from "../courses/courses.model";
import { AssignCourseDto } from "./dto/assign-course.dto";
import { Role } from "../roles/roles.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Course) private courseRepository: typeof Course,
    private roleService: RolesService
  ) {}
  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue("USER");
    await user.$set("roles", [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers(findOptions: FindWithPaginationQueryDto) {
    const { search, page, limit } = findOptions;
    const offset = (page - 1) * limit;
    const { rows: users, count } = await this.userRepository.findAndCountAll({
      where: search
        ? {
            email: {
              [Op.iLike]: `%${search}%`,
            },
          }
        : undefined,
      include: { all: true },
      offset,
      limit,
      paranoid: true,
      distinct: true,
    });

    return {
      entities: users,
      itemCount: count,
      page,
      limit,
    };
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$add("role", role.id);
      return dto;
    }
    throw new HttpException("Пользователь или роль не найдены", HttpStatus.NOT_FOUND);
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }

  async assignCourse(dto: AssignCourseDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const course = await this.courseRepository.findByPk(dto.courseId);

    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }

    if (!course) {
      throw new HttpException("Курс не найден", HttpStatus.NOT_FOUND);
    }

    const hasCourse = await user.$has("courses", course);
    if (hasCourse) {
      throw new HttpException("Курс уже назначен пользователю", HttpStatus.BAD_REQUEST);
    }

    await user.$add("courses", course);

    return dto;
  }

  async getUserCourses(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      include: [
        {
          model: Course,
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }

    return user.courses;
  }

  async getMyProfile(userId: number) {
    console.log("userId", userId)
    const user = await this.userRepository.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { 
          model: Course,
          through: { attributes: [] },
          attributes: ['id', 'title', 'description']
        }
      ]
    });

    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
