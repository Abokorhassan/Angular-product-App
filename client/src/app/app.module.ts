import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { AuthInterceptor } from './shared/authconfig.interceptor';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddProductComponent } from './components/product/add-product/add-product.component';
import { ProductDetailComponent } from './components/product/product-detail/product-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ChangePasswordComponent,
    AddProductComponent,
    ProductDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
