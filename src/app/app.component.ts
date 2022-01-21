import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    chartData = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 40632,
          "extra": {
            "code": "de"
          }
        },
        {
          "name": "2000",
          "value": 36953,
          "extra": {
            "code": "de"
          }
        },
        {
          "name": "1990",
          "value": 31476,
          "extra": {
            "code": "de"
          }
        }
      ]
    },
    {
      "name": "United States",
      "series": [
        {
          "name": "2010",
          "value": 0,
          "extra": {
            "code": "us"
          }
        },
        {
          "name": "2000",
          "value": 45986,
          "extra": {
            "code": "us"
          }
        },
        {
          "name": "1990",
          "value": 37060,
          "extra": {
            "code": "us"
          }
        }
      ]
    },
    {
      "name": "France",
      "series": [
        {
          "name": "2010",
          "value": 36745,
          "extra": {
            "code": "fr"
          }
        },
        {
          "name": "2000",
          "value": 34774,
          "extra": {
            "code": "fr"
          }
        },
        {
          "name": "1990",
          "value": 29476,
          "extra": {
            "code": "fr"
          }
        }
      ]
    },
    {
      "name": "United Kingdom",
      "series": [
        {
          "name": "2010",
          "value": 36240,
          "extra": {
            "code": "uk"
          }
        },
        {
          "name": "2000",
          "value": 32543,
          "extra": {
            "code": "uk"
          }
        },
        {
          "name": "1990",
          "value": 26424,
          "extra": {
            "code": "uk"
          }
        }
      ]
    }
  ]
  //TODO: BIG ONE - i18n localization, also, what about the pdf?
  form: FormGroup | undefined;

  heatingOptions = [{displayName: 'Gas', value: 'gas'}, {displayName: 'Strom', value: 'electricity'}, {displayName: 'Fernwärme', value: 'districtHeating'}, {displayName: 'Pellets', value: 'pellets'}, {displayName: 'Öl', value: 'oil'}];
  
  privateDefault = {
    useVat: true,
    startSituation: this.fb.group({
      showers: 1,
      workload: 90, // 1 - 100% // TODO: Limit this
      personsPerShower: 1,
      showerDuration: 7, // Minutes
      // This is different for business clients
      dailyUsagePerPerson: 1,
      waterFlow: 12, // l/min
    }),
    costs: this.fb.group({
      heatingMeans: this.heatingOptions[0],
      unitPrice: 56.7, // €   // TODO: Find out formatting for money amounts (with ',' and '.' -> Localizations?)
      coldwaterPrice: 1.93, // €/m³
      // Can always only be one of those at a time, according to 'heatingMeans'
      gasPrice: 5.796, // c/kWh  // TODO: Make price dynamic according to heatingMeans
      electricityPrice: 1,
      // ---------------------------------
      wasteWaterPrice: 2.11, // €/m³
      additionalCosts: 0, // €/m³
    }),
    optional: this.fb.group({
      projectName: [''],
      email: ['', [Validators.email]],
    }),
  };

  businessDefault = {
    useVat: false,
    startSituation: this.fb.group({
      showers: 1,
      workload: [90, [
        Validators.min(1),
        Validators.max(100)
      ]], // 1 - 100% // TODO: Limit this
      personsPerShower: 1,
      showerDuration: 7, // Minutes
      usageFactor:  1, 
      waterFlow: 12, // l/min
    }),
    costs: this.fb.group({
      heatingMeans: 'Gas',
      unitPrice: 56.7, // €   // TODO: Find out formatting for money amounts (with ',' and '.' -> Localizations?)
      coldwaterPrice: 1.93, // €/m³
      price: 5.796, // E.g.: c/kWh  // TODO: Make price dynamic according to heatingMeans
      wasteWaterPrice: 2.11, // €/m³
      additionalCosts: 0, // €/m³
    }),
    optional: this.fb.group({
      projectName: [''],
      email: ['', [Validators.email]],
    }),
  }

  
  public get email(): any {
    return this.form?.get('email');
  }
  



  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group(this.privateDefault);

    this.form.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }

  getPriceHint = (): string =>
    this.form?.get('useVat')?.value
      ? 'Alle Preise inkl. MwSt.'
      : 'Alle Preise exkl. MwSt.';

  onSelect(event: any) {
    console.log(event);
  }

  submit() {
    console.log(this.form?.controls);
  }
}
