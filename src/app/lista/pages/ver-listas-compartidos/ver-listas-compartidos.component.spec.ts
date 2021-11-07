import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerListasCompartidosComponent } from './ver-listas-compartidos.component';

describe('VerListasCompartidosComponent', () => {
  let component: VerListasCompartidosComponent;
  let fixture: ComponentFixture<VerListasCompartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerListasCompartidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerListasCompartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
