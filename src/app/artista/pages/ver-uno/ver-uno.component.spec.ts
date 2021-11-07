import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerUnoComponent } from './ver-uno.component';

describe('VerUnoComponent', () => {
  let component: VerUnoComponent;
  let fixture: ComponentFixture<VerUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerUnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
