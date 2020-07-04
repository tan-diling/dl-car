import { Request, Response, NextFunction } from 'express';
import { JsonController, Post, Get, BodyParam, Body, QueryParams, Req, QueryParam, Params, Param, NotFoundError, Patch, Delete, OnUndefined, Put } from 'routing-controllers';
import { Model, Document } from 'mongoose';

export function createCRUDController<T extends Document>(
  prefix: string,
  entityModel: Model<T>,
): any {
  @JsonController(prefix)
  class Controller {
    @Get("/")
    async getAll() {
      return await entityModel.find().exec();
    }

    @Get("/count")
    async count() {
      return await entityModel.find().countDocuments().exec();
    }

    @Get("/:id([0-9a-z]{24})")
    async get(@Param("id") id: string) {
      return await entityModel.findById(id).exec() ;
    }

    @Post("/")
    async post(@Body() body) {
      return await entityModel.create(body);
    }

    @Patch("/:id([0-9a-z]{24})")
    async Patch(@Param("id") id: string, @Body() body) {
      await entityModel.findByIdAndUpdate(id, body).exec() ;
      return await this.get(id) ;
    }

    @Delete("/:id([0-9a-z]{24})")
    async delete(@Param("id") id: string) {
      return await entityModel.findByIdAndRemove(id).exec();
    }
  }

  return Controller;
}