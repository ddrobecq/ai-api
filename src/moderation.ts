/** 
 * TODO : Convert Google and Open AI moderation approches to a generic moderation model
 */

type GenericModerationCategory = 'harassment' | 'hate_speech' | 'sexually_explicit' | 'violence';
type GenericModerationLevel = 'none' | 'low' | 'medieum' | 'high';
type GenereicModerationItem = {
    category: GenericModerationCategory,
    level: GenericModerationLevel
}
export type GenereicModerationModel = [GenereicModerationItem];
