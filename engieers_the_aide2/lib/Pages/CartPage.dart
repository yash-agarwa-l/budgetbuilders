import 'package:engieers_the_aide/Functions/BasicFunctions.dart';
import 'package:engieers_the_aide/Pages/InterestedBuilders.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  final _orderBox = Hive.box('myOrders');

  String read(String key) {
    return _orderBox.get(key, defaultValue: 'N/A');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Cart Page'),
        backgroundColor: Colors.cyan,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16.0),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.5),
                spreadRadius: 5,
                blurRadius: 7,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  'Your Order Details',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.cyan,
                  ),
                ),
              ),
              Divider(color: Colors.grey),
              ListTile(
                leading: Icon(Icons.type_specimen),
                title: Text(read("type")),

              ),
              ListTile(
                leading: Icon(Icons.location_on),
                title: Text('Area'),
                subtitle: Text(read("area")),
              ),
              ListTile(
                leading: Icon(Icons.layers),
                title: Text('Floors'),
                subtitle: Text(read("floors")),
              ),
              ListTile(
                leading: Icon(Icons.king_bed),
                title: Text('Rooms'),
                subtitle: Text(read("rooms")),
              ),
              ListTile(
                leading: Icon(Icons.attach_money),
                title: Text('Estimated Cost'),
                subtitle: Text(read("estCost")),
              ),
              Spacer(),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                  onPressed: () {
                    BasicFuctions.navigate(context, InterestedBuilders());
                  },
                  style: ElevatedButton.styleFrom(

                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 32.0, vertical: 16.0),
                  ),
                  child: Text(
                    'See the interested Builders',
                    style: TextStyle(fontSize: 18),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

