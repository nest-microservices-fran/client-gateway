import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from '../common';
import { NATS_SERVICE } from '../config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  create(
    @Body() createProducDto: CreateProductDto,
  ) {
    return this.client.send({ cmd: 'create_product' }, createProducDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
    //En este caso se trabajó con .send() porque se quiere enviar la solicitud y esperar la respuesta, la otra opción sería .emit, pero no se ajusta al caso porque esa envía la solicitud y no atiende a la respuesta, simplement se envía y se corta la comunicación.
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number
  ) {
    /*TERCERA FORMA EXPLICADA*/
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(catchError(err => { throw new RpcException(err) }));
       /*SEGUNDA FORMA EXPLICADA
    try {
      const product = await firstValueFrom (
        this.productsClient.send({ cmd: 'find_one_product' }, { id }));

      return product;
    } catch (err) {
   
      1. throw new RpcException(err); al aplicar esta línea se va pasar por el app.useGlobalFilters(new RpcCustomExceptionFilter()); en main.ts

      2. Recuerda que RpcCustomExceptionFilter atrapa los errores que sean del tipo RpcException 
      
      throw new RpcException(err);
    }*/
    /*
    PRIMERA FORMA EXPLICADA
    1- this.productsClient.send({ cmd: 'find_one_product' }, { id }) retorna un Observable, que es un flujo de información, la forma de escucharlos es aplicando .suscribe(resp => { return; })
    2 - En este caso se aplicó firstValueFrom, que permite trabajarlo como si fuera una promesa, este recibe un Observable como argumento.
    */
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.client.send({ cmd: 'update_product' }, { id, ...updateProductDto }).pipe(catchError( err => {
      throw new RpcException(err);
    }));
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(catchError( err => {
      throw new RpcException(err);
    }));
  }
}
