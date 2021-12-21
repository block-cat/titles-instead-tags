import app from 'flarum/admin/app';
import registerWidget from '../common/registerWidget';

app.initializers.add('block-cat/titles-instead-tags', () => {
    registerWidget(app);
});