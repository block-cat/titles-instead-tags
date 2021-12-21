import Widgets from 'flarum/extensions/afrux-forum-widgets-core/common/extend/Widgets';
import discussionTitles from './components/discussionTitles';

export default function (app) {
    new Widgets()
        .add({
            key: 'discussions',
            component: discussionTitles,
            isDisabled: false,
            isUnique: true,
            placement: 'end',
            position: 1,
        })
        .extend(app, 'block-cat-titles-instead-tags');
}