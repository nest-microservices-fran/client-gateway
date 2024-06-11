export enum OrdersStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED'
}

export const OrderStatusList = [
    OrdersStatus.PENDING,
    OrdersStatus.DELIVERED,
    OrdersStatus.CANCELED
];