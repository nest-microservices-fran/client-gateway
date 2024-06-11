import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../common";
import { OrderStatusList, OrdersStatus } from "./enum/order.enum";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Valid status are ${OrderStatusList}`
    })
    status: OrdersStatus;
}