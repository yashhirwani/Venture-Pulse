package com.codeblooded.Venturepulse.Controller;


import com.codeblooded.Venturepulse.Models.users;
import com.codeblooded.Venturepulse.Service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public String signup(@RequestBody users user) {
        service.signup(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public users login(@RequestBody users user) {
        return service.login(user.getEmail(), user.getPassword());
    }
}
