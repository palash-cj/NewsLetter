import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>
  ) { }

  async create(createListDto: CreateListDto) {
    const list = new List();
    list.name = createListDto.name;
    list.customFields = createListDto.customFields;

    if (createListDto.organizationId) {
      const organization = await this.organizationRepository.findOne({ where: { id: createListDto.organizationId } });
      if (organization) {
        list.organization = organization;
      }
    }

    return this.listRepository.save(list);
  }

  findAll() {
    return this.listRepository.find({ relations: ['organization'] });
  }

  async update(id: string, updateListDto: UpdateListDto) {
    const list = await this.listRepository.findOne({ where: { id } });
    if (!list) {
      throw new Error('List not found');
    }

    if (updateListDto.name) list.name = updateListDto.name;
    if (updateListDto.customFields) list.customFields = updateListDto.customFields;

    if (updateListDto.organizationId) {
      const organization = await this.organizationRepository.findOne({ where: { id: updateListDto.organizationId } });
      if (organization) {
        list.organization = organization;
      }
    }

    return this.listRepository.save(list);
  }
}