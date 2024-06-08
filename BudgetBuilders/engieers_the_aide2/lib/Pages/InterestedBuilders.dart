import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

class InterestedBuilders extends StatefulWidget {
  const InterestedBuilders({super.key});

  @override
  State<InterestedBuilders> createState() => _InterestedBuildersState();
}

class _InterestedBuildersState extends State<InterestedBuilders> {
  late Box _orderBox;
  bool isAccepted = false;

  @override
  void initState() {
    super.initState();
    _orderBox = Hive.box('myOrders');
    isAccepted = _orderBox.get('userAcc', defaultValue: false);
  }

  void put(bool value) {
    setState(() {
      isAccepted = value;
    });
    _orderBox.put('userAcc', value);
  }

  String read(String key) {
    return _orderBox.get(key, defaultValue: 'N/A');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Interested Builders'),
        backgroundColor: Colors.cyan,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              color: isAccepted ? Colors.green : null,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Builder Name: ${read("BName")}',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Price: ${read("BPrice")}',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    if (isAccepted)
                      Text(
                        'Accepted',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    if (!isAccepted)
                      ElevatedButton(
                        onPressed: () {
                          put(true);
                        },
                        child: Text("Accept"),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
