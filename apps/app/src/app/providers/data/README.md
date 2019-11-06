# **Data Provider**

## **Usage**

##### component.ts

```
@Component({
	...
})
export class Component {

	public articles = this.dataService.articles();

	constructor(
		private dataService: DataService
	) { }
}

```

##### component.html

```
<div *ngFor="let article of articles | async">
	<img src="article.imageUrl">
	<h1>{{ article.title }}</h1>
	<markdown [data]="article.content"></markdown>
</div>
```

**NOTE:** ngx-mardown must be installed to display Markdown strings. 
More info: https://www.npmjs.com/package/ngx-markdown 

#

## **Methods**


### **.news**(): Observable\<Article[]>

Returns an observable of an array of all articles.


```ts
Article {
	id: string;
	title: string;
	thumbnailImage: DocumentReference;
	thumbnailImageUrl: string;

}
```

## Happy coding! 