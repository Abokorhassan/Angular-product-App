import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  submitted = false;
  httperrors = '';

  constructor(
    public fb: FormBuilder,
    public productService: ProductService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      price: [''],
      quantity: [''],
      userID: this.authService.getUserID(),
    });
  }

  get addProductFormControls() {
    return this.addProductForm.controls;
  }

  addProduct() {
    this.submitted = true;
    if (this.addProductForm.valid) {
      this.productService.addProduct(this.addProductForm.value).subscribe(
        (res: any) => {
          // this.signupForm.reset();
          // this.httpmsgs = res;
          this.router.navigate(['product-list']);
        },
        (errors) => {
          // this.signupForm.reset();
          if (errors.status === 400) {
            this.httperrors = errors.error;
          } else {
            this.httperrors = 'Some thing went wrong!';
          }
        }
      );
    }
  }
}
