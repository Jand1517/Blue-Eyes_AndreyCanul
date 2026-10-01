import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { YugiohService } from './services/yugioh.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: YugiohService,
          useValue: {
            searchCards: () => of([]),
            getBlueEyesCollection: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the explorer and its main sections', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Blue-Eyes');
    expect(compiled.querySelector('app-search')).toBeTruthy();
    expect(compiled.querySelector('app-blue-eyes')).toBeTruthy();
  });

  it('starts in dark mode and allows switching between themes', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.isDark()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('dark');

    app.toggleTheme();
    expect(app.isDark()).toBe(false);
    expect(document.documentElement.dataset['theme']).toBe('light');

    app.toggleTheme();
    expect(app.isDark()).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
