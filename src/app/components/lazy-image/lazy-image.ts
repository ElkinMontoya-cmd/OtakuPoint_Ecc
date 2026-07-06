import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lazy-image.html',
  styleUrls: ['./lazy-image.css']
})
export class LazyImageComponent implements AfterViewInit, OnDestroy {

  @Input() src = '';

  @Input() alt = '';

  @ViewChild('imagen')
  imagen!: ElementRef<HTMLImageElement>;

  imagenReal = '';

  cargada = false;

  observer?: IntersectionObserver;

  ngAfterViewInit(): void {

    this.observer = new IntersectionObserver(

      (entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            this.imagenReal = this.src;

            this.observer?.disconnect();

          }

        });

      },

      {
        rootMargin: '300px'
      }

    );

    this.observer.observe(this.imagen.nativeElement);

  }

  onLoad() {

    this.cargada = true;

  }

  onError() {

    this.imagenReal = '/placeholder.jpg';

    this.cargada = true;

  }

  ngOnDestroy(): void {

    this.observer?.disconnect();

  }

}