import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerListasPropiosComponent } from './ver-listas-propios.component';

describe('VerListasPropiosComponent', () => {
  let component: VerListasPropiosComponent;
  let fixture: ComponentFixture<VerListasPropiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerListasPropiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerListasPropiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
