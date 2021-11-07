import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTodosGeneralComponent } from './ver-todos-general.component';

describe('VerTodosGeneralComponent', () => {
  let component: VerTodosGeneralComponent;
  let fixture: ComponentFixture<VerTodosGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTodosGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerTodosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
