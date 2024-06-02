import 'package:flutter/material.dart';
import 'package:engieers_the_aide/Functions/AuthFunctions/emailAndPass.dart';
import 'package:engieers_the_aide/Functions/AuthFunctions/googleSignIn.dart';

import 'package:firebase_auth/firebase_auth.dart';

import '../Functions/DataBaseFunctions.dart';
import '../utils/images.dart';

class authPage extends StatefulWidget {
  const authPage({super.key});

  @override
  State<authPage> createState() => _authPageState();
}

class _authPageState extends State<authPage> {

  String username = '';
  String email = '';
  String password = '';
  final _formKey = GlobalKey<FormState>();
  bool islogin = false;

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    return Scaffold(
        backgroundColor: Color.fromARGB(230, 240, 204, 176),
        body: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                SizedBox(height: screenSize.height*0.1,),
                Image.asset(
                  'assets/images/im_builder.png',
                  height: screenSize.height*0.23,
                ),
                Stack(
                  children: [Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30)),
                    ),
                    height: screenSize.height * 0.67,
                    //color: Color.fromARGB(255, 249, 244, 246),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 200),
                          child: !islogin
                              ? Text(
                                  "Sign In",
                                  style: TextStyle(
                                      color: Colors.black54,
                                      fontSize: 32,
                                      fontWeight: FontWeight.w800),
                                )
                              : Text(
                                  "Log In",
                                  style: TextStyle(
                                      color: Colors.black54,
                                      fontSize: 32,
                                      fontWeight: FontWeight.w800),
                                ),
                        ),
                        SizedBox(
                          height: 40,
                        ),
                        !islogin
                            ? Container(
                                width: screenSize.width * 0.85,
                                height: 60,
            
                                decoration: BoxDecoration(
                                    color: Color.fromARGB(250, 234, 233, 233),
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(30))),
                                //color: Color.fromARGB(255, 249, 244, 246),
                                child: Container(
                                  width: screenSize.width * 0.85,
                                  height: 60,
                                  decoration: BoxDecoration(
                                      color: Color.fromARGB(250, 234, 233, 233),
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(30))),
                                  child: TextFormField(
                                      key: ValueKey('username'),
                                      decoration: InputDecoration(
                                          border: InputBorder.none,
                                          hintText: "   User Name"),
                                      validator: (value) {
                                        if (value.toString().length <= 3) {
                                          return "Your User Name is too short";
                                        }
                                      },
                                      onSaved: (value) {
                                        setState(() {
                                          username = value!;
                                        });
                                      }),
                                ),
                              )
                            : Container(),
                        SizedBox(
                          height: 30,
                        ),
                        Container(
                          width: screenSize.width * 0.85,
                          height: 60,
                          decoration: BoxDecoration(
                              color: Color.fromARGB(250, 234, 233, 233),
                              borderRadius: BorderRadius.all(Radius.circular(30))),
                          child: TextFormField(
                              key: ValueKey('email'),
                              decoration: InputDecoration(
                                  border: InputBorder.none, hintText: "   Email"),
                              validator: (value) {
                                if (!value.toString().contains('@')) {
                                  return "Enter a valid email";
                                }
                              },
                              onSaved: (value) {
                                setState(() {
                                  email = value!;
                                  create.colName=value.toString();
                                });
                              }),
                        ),
                        SizedBox(
                          height: 30,
                        ),
                        Container(
                          width: screenSize.width * 0.85,
                          height: 60,
                          decoration: BoxDecoration(
                              color: Color.fromARGB(250, 234, 233, 233),
                              borderRadius: BorderRadius.all(Radius.circular(30))),
                          child: TextFormField(
                              obscureText: true,
                              key: ValueKey('password'),
                              decoration: InputDecoration(
                                  border: InputBorder.none,
                                  hintText: "   Password"),
                              validator: (value) {
                                if (value.toString().length <= 3) {
                                  return "Your password is too small";
                                }
                              },
                              onSaved: (value) {
                                setState(() {
                                  password = value!;
                                });
                              }),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Container(
                          decoration: BoxDecoration(
                              color: Color.fromARGB(250, 123, 233, 56),
                              borderRadius: BorderRadius.all(Radius.circular(30))),
                          width: screenSize.width * 0.65,
                          height: 50,
                          child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                foregroundColor: Colors.white,
                                backgroundColor: Colors.green, // Text color
                              ),
                              onPressed: () {

                                if (_formKey.currentState!.validate()) {
                                  _formKey.currentState!.save();
                                }
                                !islogin
                                    ? signin(email, password)
                                    : login(email, password);

                              },
                              child: !islogin ? Text("SignUp") : Text("Login")),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Container(
                          decoration: BoxDecoration(
                              color: Color.fromARGB(250, 123, 233, 56),
                              borderRadius: BorderRadius.all(Radius.circular(30))),
                          width: screenSize.width * 0.65,
                          height: 50,
                          child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                foregroundColor: Colors.white,
                                backgroundColor: Colors.green, // Text color
                              ),
                              onPressed: () async {
                                GoogleAuth auth = GoogleAuth();
                                UserCredential? userCredential =
                                    await auth.signInWithGoogle();
                                if (userCredential != null) {
                                  print(
                                      "Sign-In Successful: ${userCredential.user?.displayName}");
                                } else {
                                  print("Sign-In Failed");
                                }
                              },
                              child: Text("Sign in with Google")),
                        ),
                        SizedBox(
                          height: 5,
                        ),
                        InkWell(
                          child: !islogin
                              ? Text("Already Signed in? Login")
                              : Text("Sign in"),
                          onTap: () { setState(() {
                            islogin = !islogin;
                          });
                          }
                        ),
                      ],
                    ),
                    width: double.infinity,
                  ),
                ]),
              ],
            ),
          ),
        ));
  }
}
