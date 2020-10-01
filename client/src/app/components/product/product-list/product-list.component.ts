import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from 'src/app/services/product/product.service';

import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'price',
    'quantity',
    'user',
    'action',
  ];
  ELEMENT_DATA = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  userID = this.authService.getUserID();

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.getProductList();
    this.dataSource.sort = this.sort;
  }

  constructor(
    public productService: ProductService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.productService.getProductLists().subscribe(
      (res) => {
        this.dataSource = res;
        this.dataSource.sort = this.sort;
      },
      (errors) => {
      }
    );
  }

  goToDetailPage(id) {
    this.router.navigate([`product/${id}`]);
  }

  hasPrivilageToUpdate(id) {
    if (this.userID === id) {
      return true;
    } else {
      false;
    }
  }
}
