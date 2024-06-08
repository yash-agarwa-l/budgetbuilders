//for logout
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
class DrawerFunctions{
Future<void> _logoutDialogBox(BuildContext context) async {
  return showDialog<void>(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text('Logout'),
        content: Text('Are you sure you want to logout?'),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              // Perform logout action
              Navigator.of(context).pop();
            },
            child: Text('Logout'),
          ),
        ],
      );
    },
  );
}}