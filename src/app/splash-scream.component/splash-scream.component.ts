import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-scream.component',
  imports: [],
  templateUrl: './splash-scream.component.html',
  styleUrl: './splash-scream.component.css'
})
export class SplashScreamComponent {

  
  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']); // Redirige a "/home" después de 3 segundos
    }, 50000);
  }
}
