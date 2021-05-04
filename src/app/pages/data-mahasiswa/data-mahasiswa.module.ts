import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataMahasiswaRoutingModule } from './data-mahasiswa-routing.module';
import { MahasiswaComponent } from './mahasiswa/mahasiswa.component';


@NgModule({
  declarations: [MahasiswaComponent],
  imports: [
    CommonModule,
    DataMahasiswaRoutingModule
  ]
})
export class DataMahasiswaModule { }
