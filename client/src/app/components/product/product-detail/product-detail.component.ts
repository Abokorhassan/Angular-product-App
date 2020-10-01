import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Product } from 'src/app/models/product';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  updateProductForm: FormGroup;
  submitted = false;
  httperrors = '';

  constructor(
    public fb: FormBuilder,
    public productService: ProductService,
    public authService: AuthService,
    public router: ActivatedRoute,
    public route: Router
  ) {}

  ngOnInit() {
    this.productData();
    const id = this.router.snapshot.paramMap.get('id');
    this.getProduct(id);
  }

  productData() {
    this.updateProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      price: [''],
      quantity: [''],
    });
  }

  get updateProductFormControls() {
    return this.updateProductForm.controls;
  }

  updateproudct() {
    let userID = this.authService.getUserID();
    const dataForm = this.updateProductForm.value;
    const id = this.router.snapshot.paramMap.get('id');

    dataForm['userID'] = userID;
    this.submitted = true;

    if (this.updateProductForm.valid) {
      this.productService
        .updateProduct(id, this.updateProductForm.value)
        .subscribe(
          (res: any) => {
            this.route.navigate(['product-list']);
          },
          (errors) => {
            if (errors.status === 400) {
              this.httperrors = errors.error;
            } else {
              this.httperrors = 'Some thing went wrong!';
            }
          }
        );
    }
  }

  getProduct(id) {
    if (id) {
      this.productService.getProduct(id).subscribe(
        (res: any) => {
          this.updateProductForm.setValue(res);
        },
        (errors) => {
          if (errors.status === 400) {
            this.httperrors = errors.error;
          } else {
            this.httperrors = 'Some thing went wrong!';
          }
        }
      );
    }
  }

  deleteProduct() {
    const id = this.router.snapshot.paramMap.get('id');
    this.productService.deleteProduct(id).subscribe(
      (res) => {
        this.route.navigate(['product-list']);
      },

      (errors) => {}
    );
  }
}
