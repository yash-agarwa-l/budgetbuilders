import 'package:engieers_the_aide/Widgets/Specific/ProfilePageWidgets.dart';
import 'package:flutter/material.dart';
class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Profile"),
      ),
      body: Container(
        child: Column(
          children: [
            ElevatedButton(onPressed: (){Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ManageAccount()));}, child: Text("Manage Account"))
          ],
        ),
      ),
    );
  }
}
