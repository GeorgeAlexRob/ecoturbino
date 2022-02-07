import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Color, ScaleType } from '@swimlane/ngx-charts';

enum UsageTypeEnum {
  PRIVATE,
  BUSINESS,
}

interface UsageFactorOption {
  name: string;
  factor: number;
}

interface HeatingOption {
  name: string;
  price: number;
  unit: string;
}

interface EcoturbinoOption {
  name: string;
  economyPercentage: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  UsageTypeEnum: typeof UsageTypeEnum = UsageTypeEnum;

  private usageTypeForm = {
    usageType: [UsageTypeEnum.PRIVATE, Validators.required],
  };
  usageTypeFormGroup = this._formBuilder.group(this.usageTypeForm);

  public get usageType(): UsageTypeEnum {
    return this.usageTypeFormGroup.get('usageType')?.value;
  }

  usageFactorOptions: UsageFactorOption[] = [
    { name: 'Standard', factor: 1.0 },
    { name: 'Sporthotel', factor: 1.2 },
    { name: 'Wellnesshotel', factor: 1.2 },
    { name: 'Businesshotel', factor: 1.5 },
    { name: 'Kurhotel', factor: 1.5 },
    { name: 'Industriebetrieb', factor: 1.5 },
  ];

  ecoturbinoTypes: EcoturbinoOption[] = [
    { name: 'WR9', economyPercentage: 0.3 },
    { name: 'WR10', economyPercentage: 0.4 },
    { name: 'WR11', economyPercentage: 0.5 },
  ];

  private usageForm = {
    showers: [1, Validators.required],
    showerDuration: [7, Validators.required],
    // dailyUsagePerPerson: [1, Validators.required],
    usageFactor: this.usageFactorOptions[0],
    waterflow: [12, Validators.required],
    workload: [90, Validators.required],
    ecoturbinoType: [this.ecoturbinoTypes[0], [Validators.required]],
  };
  usageFormGroup = this._formBuilder.group(this.usageForm);

  public get showers(): number {
    return this.usageFormGroup.get('showers')?.value;
  }

  public get workload(): number {
    return this.usageFormGroup.get('workload')?.value;
  }

  public get showerDuration(): number {
    return this.usageFormGroup.get('showerDuration')?.value;
  }

  public get usageFactor(): number {
    return (this.usageFormGroup.get('usageFactor')?.value as UsageFactorOption)
      .factor;
  }

  public get waterflow(): number {
    return this.usageFormGroup.get('waterflow')?.value;
  }

  // HeatingTypeEnum: typeof HeatingTypeEnum = HeatingTypeEnum;

  heatingOptions: HeatingOption[] = [
    {
      // type: HeatingTypeEnum.GAS,
      name: 'Gas',
      price: 14.108,
      unit: 'c/kWh',
    }, // c/kWh
    {
      // type: HeatingTypeEnum.ELECTRICITY,
      name: 'Strom',
      price: 23.96,
      unit: 'c/kWh',
    }, // c/kWh
    {
      // type: HeatingTypeEnum.DISTRICTHEATING,
      name: 'Fernwärme',
      price: 6.279,
      unit: '€/m³',
    }, // €/m3
    {
      // type: HeatingTypeEnum.PELLETS,
      name: 'Pellets',
      price: 30,
      unit: 'c/kg',
    }, // c/kg
    {
      // type: HeatingTypeEnum.OIL,
      name: 'Öl',
      price: 95.3,
      unit: 'c/l',
    }, // c/l
  ];

  private costsForm = {
    heatingMeans: [this.heatingOptions[0], Validators.required],
    heatingPrice: [this.heatingOptions[0].price, Validators.required],
    coldwaterPrice: [2.02, Validators.required], // €/m³
    wastewaterPrice: [2.22, Validators.required], // €/m³
    unitPrice: [47.88, Validators.required], // €
    additionalCosts: 0, // €/m³
    co2Costs: 36,
  };
  costsFormGroup = this._formBuilder.group(this.costsForm);

  public get heatingMeans(): HeatingOption {
    return this.costsFormGroup.get('heatingMeans')?.value;
  }

  public get heatingPrice(): number {
    return this.costsFormGroup.get('heatingPrice')?.value;
  }

  public get coldwaterPrice(): number {
    return this.costsFormGroup.get('coldwaterPrice')?.value;
  }

  public get wastewaterPrice(): number {
    return this.costsFormGroup.get('wastewaterPrice')?.value;
  }

  public get unitPrice(): number {
    return this.costsFormGroup.get('unitPrice')?.value;
  }

  private resultForm = {
    project: '',
    email: ['', [Validators.email]],
  };
  resultFormGroup = this._formBuilder.group(this.resultForm);

  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.usageTypeFormGroup
      .get('usageType')
      ?.valueChanges.subscribe((next: UsageTypeEnum) =>
        next === UsageTypeEnum.PRIVATE
          ? this.addVatOnAllPrices()
          : this.removeVatOnAllPrices()
      );

    this.costsFormGroup
      .get('heatingMeans')
      ?.valueChanges.subscribe((next: HeatingOption) => {
        console.log(next);

        this.costsFormGroup
          .get('heatingPrice')
          ?.setValue(
            this.usageType === UsageTypeEnum.BUSINESS
              ? this.removeVat(next.price)
              : next.price
          );
      });
  }

  // private initForms(): void {
  //   this.usageTypeFormGroup = this._formBuilder.group(this.usageTypeForm);
  //   this.usageFormGroup = this._formBuilder.group(this.usageForm);
  //   this.costsFormGroup = this._formBuilder.group(this.costsForm);
  //   this.resultFormGroup = this._formBuilder.group(this.resultForm);
  // }

  // private resetAllForms(): void {
  //   this.usageTypeFormGroup.reset();
  //   this.usageFormGroup.reset();
  //   this.costsFormGroup.reset();
  //   this.resultFormGroup.reset();
  // }

  private addVatOnAllPrices = (): void =>
    ['heatingPrice', 'coldwaterPrice', 'wastewaterPrice', 'unitPrice'].forEach(
      (formCtrlName) => {
        const price = this.costsFormGroup.get(formCtrlName)?.value;
        this.costsFormGroup.get(formCtrlName)?.setValue(this.addVat(price));
      }
    );

  private removeVatOnAllPrices = (): void =>
    ['heatingPrice', 'coldwaterPrice', 'wastewaterPrice', 'unitPrice'].forEach(
      (formCtrlName) => {
        const price = this.costsFormGroup.get(formCtrlName)?.value;
        this.costsFormGroup.get(formCtrlName)?.setValue(this.removeVat(price));
      }
    );

  private removeVat = (price: number, vat?: number): number =>
    this.toCurrency((price / (100 + (vat || 20))) * 100);

  private addVat = (price: number, vat?: number): number =>
    this.toCurrency((price / 100) * (100 + (vat || 20)));

  private toCurrency = (num: number, decimalPoints?: number): number =>
    +(Math.round(num * 100) / 100).toFixed(decimalPoints || 2);

  acquisitionCosts = (): number => this.unitPrice * this.showers;
  moneySavedPerAnno = (): number => 0;
  amortizationPeriod = (): number => 0;
  waterSaved = (): number => 0;
  kwhSaved = (): number => 0;
  gjSaved = (): number => 0;
  tonsCo2Saved = (): number => 0;
  moneyCo2Saved = (): number => 0;

  chartData = [
    {
      name: 'Jetzt',
      series: [
        {
          name: 'Berechnete Kosten',
          value: 310,
        },
      ],
    },

    {
      name: 'Im 1. Jahr',
      series: [
        {
          name: 'Berechnete Kosten',
          value: 180,
        },
        {
          name: 'Einmalige Anschaffungskosten',
          value: this.acquisitionCosts(),
        },
        {
          name: 'Zukünftiges Ersparnis',
          value: 75,
        },
      ],
    },

    {
      name: 'Darauffolgende Jahre',
      series: [
        {
          name: 'Berechnete Kosten',
          value: 180,
        },
        {
          name: 'Zukünftiges Ersparnis',
          value: 120,
        },
      ],
    },
  ];

  colorScheme: Color = {
    domain: ['#A40606', '#C7B42C', '#5AA454'],
    name: 'colors',
    selectable: false,
    group: ScaleType.Linear,
  };

  onSelect(event: any): void {
    return;
  }
}
