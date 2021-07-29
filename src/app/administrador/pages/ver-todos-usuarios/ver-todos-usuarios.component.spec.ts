import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTodosUsuariosComponent } from './ver-todos-usuarios.component';

describe('VerTodosUsuariosComponent', () => {
  let component: VerTodosUsuariosComponent;
  let fixture: ComponentFixture<VerTodosUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerTodosUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerTodosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
