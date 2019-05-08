import { NgModule } from  '@angular/core';
import { MatNativeDateModule,MatDatepickerModule,MatIconModule,MatButtonModule,MatCheckboxModule, MatToolbarModule, MatCardModule,MatFormFieldModule,MatInputModule,MatRadioModule,MatListModule,MatSelectModule} from  '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
imports: [MatIconModule,MatSelectModule,MatButtonModule,FormsModule, MatCardModule,MatFormFieldModule,MatInputModule],

exports: [MatIconModule,MatSelectModule,MatButtonModule,FormsModule, MatCardModule,MatFormFieldModule,MatInputModule],

})

export  class  MyMaterialModule { }
