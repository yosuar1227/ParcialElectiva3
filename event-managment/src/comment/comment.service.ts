import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository : Repository<Comment>,

    private readonly userService : UserService,

    private readonly eventService : EventService

  ){}

  async create(createCommentDto: CreateCommentDto, userId : number, eventId : number) {
    const user = await this.userService.findOne(userId);
    const event = await this.eventService.findOne(eventId);
    try {
      const comment : Comment = this.commentRepository.create({
        ...createCommentDto,
        user : user,
        event : event
      });
      await this.commentRepository.save(comment);
      return comment;
    } catch (error) {
      throw new InternalServerErrorException(error.name)
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const newComment = await this.commentRepository.preload({id, ...updateCommentDto});
    if(!newComment) throw new NotFoundException(`Comment with id ${id} not found`);
    await this.commentRepository.save(newComment);
    return newComment;
  }

  async remove(id: number) {
    const commentRemoved = await this.commentRepository.findOneBy({id});
    if(!commentRemoved) throw new NotFoundException(`Comment with id ${id} not found`);
    await this.commentRepository.remove(commentRemoved);
    return commentRemoved;
  }
}
