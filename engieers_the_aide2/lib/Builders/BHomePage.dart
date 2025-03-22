import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

class BHomePage extends StatefulWidget {
  const BHomePage({super.key});

  @override
  State<BHomePage> createState() => _BHomePageState();
}

class _BHomePageState extends State<BHomePage> {
  late Box _order;
  bool isAccepted = false;

  @override
  void initState() {
    super.initState();
    _order = Hive.box('myOrders');
  }

  void set(String amt){
    _order.put("bAmt",amt);
  }

  String read(String key) {
    return _order.get(key, defaultValue: 'N/A');
  }

  void setAccepted(bool value) {
    setState(() {
      isAccepted = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Deals'),
        backgroundColor: Colors.cyan,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              color: isAccepted ? Colors.green[100] : Colors.white,
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Area: ${read("area")}',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Floors: ${read("floors")}',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Rooms: ${read("rooms")}',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Estimated Cost: ${read("estCost")}',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    if (isAccepted)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: Text(
                          'Accepted',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.green),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            if (!isAccepted)
              SizedBox(height: 20),
            if (!isAccepted)
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      showAcceptDialog(context, setAccepted);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    child: Text(
                      "Accept",
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                  SizedBox(width: 50),
                  ElevatedButton(
                    onPressed: () {
                      // Handle ignore action
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    child: Text(
                      "Ignore",
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

class AcceptDialog extends StatefulWidget {
  final Function(bool) onConfirm;

  const AcceptDialog({required this.onConfirm, super.key});

  @override
  State<AcceptDialog> createState() => _AcceptDialogState();
}

class _AcceptDialogState extends State<AcceptDialog> {
  final _orderBox = Hive.box('myOrders');
  final _amountController = TextEditingController();

  void add(String amount) {
    _orderBox.put("BPrice", amount);
  }
  String read() {
    return _orderBox.get("BPrice");
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Accept'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('How much Amount Would suffice you?'),
          TextFormField(
            controller: _amountController,
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: "Enter Amount",
            ),
          ),
        ],
      ),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            add(_amountController.text);
            print(read());

            add(_amountController.text);
            widget.onConfirm(true);
            Navigator.of(context).pop(); // Close the dialog
          },
          child: Text('Confirm'),
        ),
      ],
    );
  }
}

// Usage
void showAcceptDialog(BuildContext context, Function(bool) onConfirm) {
  showDialog<void>(
    context: context,
    builder: (BuildContext context) {
      return AcceptDialog(onConfirm: onConfirm);
    },
  );
}
