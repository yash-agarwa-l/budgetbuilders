

import 'package:flutter/material.dart';
class BasicFuctions {
  static void navigate(BuildContext context, Widget page) {
    Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => page));
  }
}