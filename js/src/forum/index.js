import app from 'flarum/forum/app';
import registerWidget from '../common/registerWidget';
import { extend, override } from 'flarum/extend';
import StartBottomWidgetSection from 'flarum/extensions/afrux-forum-widgets-core/forum/components/StartBottomWidgetSection';
import IndexPage from 'flarum/components/IndexPage';
import sortWidgets from '../common/utils/sortWidgets';

app.initializers.add('block-cat/titles-instead-tags', () => {
    registerWidget(app);

    override(StartBottomWidgetSection.prototype, 'view', function (original) {
        return (
            <div className="AfruxWidgets-startBottom AfruxWidgets-WidgetSection">
              {sortWidgets(app.widgets.get('start_bottom')).map((widget) => widget.component.component({ state: widget.state }))}
            </div>
          );
    });

    extend(IndexPage.prototype, 'navItems', function (items) {
        const tags = app.store.all('tags');

        tags.map((tag) => {
            if (items.has('tag' + tag.id())) {
                items.remove('tag' + tag.id());
            }
        });

        if (items.has('moreTags')) {
            items.remove('moreTags');
        }
    });
});