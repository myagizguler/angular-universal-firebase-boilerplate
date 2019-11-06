import { Component, OnInit } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { LanguageService } from './providers/language/language.service';
import { DataToolsService } from './providers/data/data-tools.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private ga: Angulartics2GoogleAnalytics,
    private languageService: LanguageService,
    private dataTools: DataToolsService
  ) { }

  ngOnInit() {
    this.ga.startTracking();
    this.dataTools.languageObservable = this.languageService.change;

  }

}
