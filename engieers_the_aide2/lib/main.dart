import 'package:engieers_the_aide/Builders/BHomePage.dart';
import 'package:engieers_the_aide/Functions/BasicFunctions.dart';
import 'package:engieers_the_aide/Widgets/Specific/HomePageWidgets.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:engieers_the_aide/firebase_options.dart';
import 'package:engieers_the_aide/Pages/LoginPage.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:engieers_the_aide/Pages/HomePage.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/adapters.dart';
//import 'database.dart';
import 'Builders/BAuthPage.dart';
import 'Pages/BottomNavigationBar.dart';
import 'firebase_options.dart';



import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'firebase_options.dart';
import 'Pages/BottomNavigationBar.dart';
import 'Pages/LoginPage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await Hive.initFlutter();
  await Hive.openBox('myOrders');
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
        backgroundColor: Colors.cyan,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                navigateToUser(context);
              },
              style: ElevatedButton.styleFrom(
                //primary: Colors.cyan,
                padding: EdgeInsets.symmetric(horizontal: 32.0, vertical: 16.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16.0),
                ),
              ),
              child: Text(
                "User Login",
                style: TextStyle(fontSize: 18),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const Builder()),
                );
              },
              style: ElevatedButton.styleFrom(
                //primary: Colors.cyan,
                padding: EdgeInsets.symmetric(horizontal: 32.0, vertical: 16.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16.0),
                ),
              ),
              child: Text(
                "Builder Login",
                style: TextStyle(fontSize: 18),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void navigateToUser(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const User()),
    );
  }
}

class User extends StatelessWidget {
  const User({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(stream: FirebaseAuth.instance.authStateChanges(),builder: (context,snapshot){
      if(snapshot.hasData){
        return BottomNav();
      }
      else{
        return authPage();
      }
    },);
  }
}

class Builder extends StatelessWidget {
  const Builder({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(stream: FirebaseAuth.instance.authStateChanges(),builder: (context,snapshot){
      if(snapshot.hasData){
        return BHomePage();
      }
      else{
        return BAuthPage();
      }
    },);
  }
}

