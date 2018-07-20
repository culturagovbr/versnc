import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatTableModule,
  MatIconModule,
  MatMenuModule,
  MatPaginatorModule,
  MatGridListModule,
  MatCardModule,
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatExpansionModule,
  MatChipsModule,
  MatSortModule,
  MatSelectModule,
  MatTooltipModule,
  MatDatepickerModule,
  NativeDateAdapter,
  MatNativeDateModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatNativeDateModule
  ],
  exports: [
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatExpansionModule,
    MatChipsModule,
    MatSortModule,
    MatSelectModule,
    MatTooltipModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
    ],
  declarations: []
})
export class MaterialModule { }
