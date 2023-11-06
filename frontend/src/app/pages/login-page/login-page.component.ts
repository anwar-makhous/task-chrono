import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  invalidLogin: Boolean;

  ngOnInit() {
    this.invalidLogin = false;

  }

  onLoginButtonClicked(email: string, password: string) {
    new Promise((resolve, reject) => {
      // Simulate an asynchronous operation, e.g., fetching data from a server
      setTimeout(() => {
        this.invalidLogin = true;
      }, 1000);
    });

    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        // we have logged in successfully
        this.router.navigate(['/projects']);
      }

    });

  }

}
