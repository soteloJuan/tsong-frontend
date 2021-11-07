import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerUnUsuarioComponent } from './ver-un-usuario.component';

describe('VerUnUsuarioComponent', () => {
  let component: VerUnUsuarioComponent;
  let fixture: ComponentFixture<VerUnUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerUnUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerUnUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
