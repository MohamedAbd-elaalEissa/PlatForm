import { Component } from '@angular/core';
import { ProductService, Product } from '../../service/product.service';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
@Component({
  selector: 'app-tasks',
  imports: [DataView,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule],
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  providers: [ProductService]
})
export class TasksComponent {

  layout: 'list' | 'grid' = 'list';

  products = signal<any>([]);

  options = ['list', 'grid'];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().then((data) => {
      console.log("🚀 ~ TasksComponent ~ this.productService.getProducts ~ data:", data)
      this.products.set([...data]);
    });
  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }


}
