import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerUnoCompartidosComponent } from './ver-uno-compartidos.component';

describe('VerUnoCompartidosComponent', () => {
  let component: VerUnoCompartidosComponent;
  let fixture: ComponentFixture<VerUnoCompartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerUnoCompartidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerUnoCompartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
