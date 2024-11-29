import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository : Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    const newcategory = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(newcategory); 
    return newcategory;
  }

  async findAll() {
    const categories = await this.categoryRepository.find({});
    if(!categories) throw new NotFoundException('Categories not register yet')
    return categories;
  }

  async findOne(id : number) {
    const foundCategory = await this.categoryRepository.findOneBy({id});
    if(!foundCategory) throw new NotFoundException(`Category with id ${id} not found`)
    return foundCategory;
  }
  
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const updateCategory = await this.categoryRepository.preload({id, ...updateCategoryDto});
    if(!updateCategory) throw new NotFoundException();
    await this.categoryRepository.save(updateCategory);
    return updateCategory;
  }

}
