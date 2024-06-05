import { PublicService } from 'src/app/services/generic/public.service';
import { TranslateModule } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent {
  @Input() item: any;
  currentLanguage: string = '';

  constructor(
    private publicService: PublicService
  ) { }

  ngOnInit(): void {

  }
}
