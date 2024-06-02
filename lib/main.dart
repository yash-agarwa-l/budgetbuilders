import 'package:engieers_the_aide/Widgets/Specific/HomePageWidgets.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:engieers_the_aide/firebase_options.dart';
import 'package:engieers_the_aide/Pages/LoginPage.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:engieers_the_aide/Pages/HomePage.dart';
//import 'database.dart';
import 'Pages/BottomNavigationBar.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(await MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        primarySwatch: Colors.blue, // Set the primary swatch
      ),
      debugShowCheckedModeBanner: false,
      home: StreamBuilder(stream: FirebaseAuth.instance.authStateChanges(),builder: (context,snapshot){
          if(snapshot.hasData){
            return BottomNav();
          }
          else{
            return authPage();
          }
      },),
    );
  }
}
