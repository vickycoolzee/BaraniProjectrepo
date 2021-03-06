import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { OrderServiceService } from 'src/app/service/order-service.service';
import { ActivatedRoute ,Router} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import  Swal from 'sweetalert2';
@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  classapplied = false

  productDetailsForm: FormGroup
  value1:any
  value4:any
  value2:any
  value3:any
  rfId: string
  isSelect = false
  isPaymentTermsDays = false  
  verify_status:boolean = false;

  constructor(private router: Router, private formbuilder: FormBuilder,private SpinnerService: NgxSpinnerService, private orderService: OrderServiceService,private route:ActivatedRoute) { 
    this.value1 = this.route.snapshot.params.id

  }
  action(){
    this.classapplied = !this.classapplied
   }

  verfiy(){
    this.SpinnerService.show();
    let data = {
      RFQ_id :this.productDetailsForm.get('RFQ_id').value,
      Customer_detail : this.productDetailsForm.get('Customer_id').value
    }
    console.log(this.value4)
    
    this.verify_status = true

    this.orderService.Post_Order_Detail(data).subscribe(
      data =>{
        this.SpinnerService.hide();
        Swal.fire('Verfied Sucessfully','No Duplication are Found You can proced now','success').then((result)=>{
          if (result.value){
            document.getElementById('verify').innerHTML="Verified!!!";
            document.getElementById('verify').style.backgroundColor = '#5cb85c';
            document.getElementById('product').hidden = false
  
          }})

      },
      error =>{
        this.SpinnerService.hide();
        Swal.fire("OOPS Verification failed",'Please Verify the Data well','error')
      }
    )
    
  }

  ngOnInit(): void {
    this.orderService.Cet_Customer_Detail(this.value1)
      .subscribe(item => {
        this.productDetailsForm.get('Customer_id').setValue(item.Customer_id)
        this.value2 = item.Customer_name
        this.value3 = item.Customer_id 
        this.productDetailsForm.get('RFQ_id').setValue(this.value3[0].toLocaleUpperCase()+this.value3.slice(this.value3.length-1).toLocaleUpperCase())
        this.value4 = this.productDetailsForm.get('RFQ_id').value   
      })
    this.productDetailsForm = this.formbuilder.group({
      RFQ_id :[],
      Customer_id:[],
      product_detail :this.formbuilder.array([this.add_product_detail()])

    })        
  }
  
  showCastingSelect(i){
    
    if (this.productDetailsForm.get('product_detail').value[i]['Casting_type'] == 'Machinary'){
       this.isSelect = true

      }
    else{
      this.isSelect = false
    }  
        
      
  }

  showPaymentTermsDays(i){
    if (this.productDetailsForm.get('product_detail').value[i]['Payment_terms'] == 'days'){
      this.isPaymentTermsDays = true

    }

  }
  
  submit(){
    console.log(this.productDetailsForm.get('product_detail').value,this.value4)
    this.orderService.Post_Product_Detail(this.productDetailsForm.get('product_detail').value).subscribe(data =>{
      Swal.fire("Successfully Added!!!","Data Added successfully to Server","success").then((result)=>{
        if (result.value){
          this.router.navigateByUrl("Marketing/Customer")
        }
      })
    },
    error =>{
      Swal.fire("Unable to push data","Please Verfiy the details given above unable to update ","error")
    })

  }
  add_product_detail(){
    let product = this.formbuilder.group({
      Product_id: [],
      Ventor_code: [],
      Part_code: [],
      Part_name: [],
      Casting_type: [],
      Pattern_scope: [],
      Transport: [],
      Painting_method: [],
      Packing_type: [],
      Machinary_type:[] ,
      Payment_terms: [],
      Export_required: [],
      Payments_terms_days:[],
      Quantity: [],
      Is_feasiable: [],
      RFQ_detail: [],

    })
  

    return product
  }



  get productArray() {
    return <FormArray>this.productDetailsForm.get('product_detail');
  }


  addproduct(){
    
    this.productArray.push(this.add_product_detail());

  }


  removeproduct(index){

    if(index != 0){
      this.productArray.removeAt(index);
    }

  }






}
