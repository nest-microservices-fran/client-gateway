import { IsEnum, IsOptional } from "class-validator";
import { OrderStatusList, OrdersStatus } from "./enum/order.enum";

export class StatusDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Valid status are ${OrderStatusList}`
    })
    status: OrdersStatus;
}