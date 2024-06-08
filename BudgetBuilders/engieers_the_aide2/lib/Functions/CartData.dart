import 'Orders.dart';

class CartData{
  List<Orders> data=[];

  void addProduct(Orders order){
    data.add(order);
  }
}

