import { PublicService } from 'src/app/services/generic/public.service';
import { TranslateModule } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() deleteHandler = new EventEmitter();
  @Output() editHandler = new EventEmitter();

  currentLanguage: string = '';

  constructor(
    private publicService: PublicService
  ) { }

  ngOnInit(): void {
    this.currentLanguage = this.publicService.getCurrentLanguage();

  }

  deleteBlog(item: any): void {
    this.deleteHandler.emit(item);
  }
  editBlog(item: any): void {
    this.editHandler.emit(item);
  }
}
