import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  isDisabled: any = null;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startmonth: ' + startMonth);
    this.formService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log('Retrieved credit card montsh: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    });

    // populate credit card years
    this.formService.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });
  }

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(
      'the email address is ',
      this.checkoutFormGroup.get('customer')?.value.email
    );
  }

  copyShippingAddressToBillingAddress(event: any) {
    console.log('event?.currentTarget?.checked', event?.currentTarget?.checked);
    this.isDisabled = this.isDisabled ? null : true;
    if (event?.currentTarget?.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    //  if the current year equals the selected year, then start with the current month
    let startMonth: number =
      currentYear === selectedYear ? new Date().getMonth() + 1 : 1;

    this.checkoutFormGroup.controls['creditCard'].patchValue({
      expirationMonth: startMonth,
    });

    this.formService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log('retrieved credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    });
  }
}
