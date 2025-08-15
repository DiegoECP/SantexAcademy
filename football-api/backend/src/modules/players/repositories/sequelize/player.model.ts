// modules/players/repositories/sequelize/player.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'players', timestamps: false })
export class PlayerModel extends Model<PlayerModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ field: 'fifa_version', type: DataType.STRING })
  declare fifaVersion: string;

  @Column({ field: 'fifa_update', type: DataType.STRING })
  declare fifaUpdate: string;

  @Column({ field: 'player_face_url', type: DataType.STRING })
  declare playerFaceUrl: string;

  @Column({ field: 'long_name', type: DataType.STRING })
  declare longName: string;

  @Column({ field: 'player_positions', type: DataType.STRING })
  declare playerPositions: string;

  @Column({ field: 'club_name', type: DataType.STRING, allowNull: true })
  declare clubName?: string;

  @Column({ field: 'nationality_name', type: DataType.STRING, allowNull: true })
  declare nationalityName?: string;

  @Column(DataType.INTEGER)
  declare overall: number;

  @Column(DataType.INTEGER)
  declare potential: number;

  @Column({ field: 'value_eur', type: DataType.INTEGER, allowNull: true })
  declare valueEur?: number;

  @Column({ field: 'wage_eur', type: DataType.INTEGER, allowNull: true })
  declare wageEur?: number;

  @Column(DataType.INTEGER)
  declare age: number;

  @Column({ field: 'height_cm', type: DataType.INTEGER, allowNull: true })
  declare heightCm?: number;

  @Column({ field: 'weight_kg', type: DataType.INTEGER, allowNull: true })
  declare weightKg: number | null;

  @Column({ field: 'preferred_foot', type: DataType.STRING, allowNull: true })
  declare preferredFoot: string | null;

  @Column({ field: 'weak_foot', type: DataType.INTEGER, allowNull: true })
  declare weakFoot: number | null;

  @Column({ field: 'skill_moves', type: DataType.INTEGER, allowNull: true })
  declare skillMoves: number | null;

  @Column({ field: 'international_reputation', type: DataType.INTEGER, allowNull: true, })
  declare internationalReputation: number | null;

  @Column({ field: 'work_rate', type: DataType.STRING, allowNull: true })
  declare workRate: string | null;

  @Column({ field: 'body_type', type: DataType.STRING, allowNull: true })
  declare bodyType: string | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare pace: number | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare shooting: number | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare passing: number | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare dribbling: number | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare defending: number | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare physic: number | null;

  @Column({ field: 'attacking_crossing', type: DataType.INTEGER, allowNull: true })
  declare attackingCrossing: number | null;

  @Column({ field: 'attacking_finishing', type: DataType.INTEGER, allowNull: true })
  declare attackingFinishing: number | null;

  @Column({ field: 'attacking_heading_accuracy', type: DataType.INTEGER, allowNull: true})
  declare attackingHeadingAccuracy: number | null;

  @Column({ field: 'attacking_short_passing',  type: DataType.INTEGER, allowNull: true })
  declare attackingShortPassing: number | null;

  @Column({ field: 'attacking_volleys', type: DataType.INTEGER, allowNull: true })
  declare attackingVolleys: number | null;

  @Column({ field: 'skill_dribbling', type: DataType.INTEGER, allowNull: true })
  declare skillDribbling: number | null;

  @Column({ field: 'skill_curve', type: DataType.INTEGER, allowNull: true })
  declare skillCurve: number | null;

  @Column({ field: 'skill_fk_accuracy', type: DataType.INTEGER, allowNull: true })
  declare skillFkAccuracy: number | null;

  @Column({ field: 'skill_long_passing', type: DataType.INTEGER, allowNull: true })
  declare skillLongPassing: number | null;

  @Column({ field: 'skill_ball_control', type: DataType.INTEGER, allowNull: true })
  declare skillBallControl: number | null;

  @Column({ field: 'movement_acceleration', type: DataType.INTEGER, allowNull: true })
  declare movementAcceleration: number | null;

  @Column({ field: 'movement_sprint_speed', type: DataType.INTEGER, allowNull: true })
  declare movementSprintSpeed: number | null;

  @Column({ field: 'movement_agility', type: DataType.INTEGER, allowNull: true })
  declare movementAgility: number | null;

  @Column({ field: 'movement_reactions', type: DataType.INTEGER, allowNull: true })
  declare movementReactions: number | null;

  @Column({ field: 'movement_balance', type: DataType.INTEGER, allowNull: true })
  declare movementBalance: number | null;

  @Column({ field: 'power_shot_power', type: DataType.INTEGER, allowNull: true })
  declare powerShotPower: number | null;

  @Column({ field: 'power_jumping', type: DataType.INTEGER, allowNull: true })
  declare powerJumping: number | null;

  @Column({ field: 'power_stamina', type: DataType.INTEGER, allowNull: true })
  declare powerStamina: number | null;

  @Column({ field: 'power_strength', type: DataType.INTEGER, allowNull: true })
  declare powerStrength: number | null;

  @Column({ field: 'power_long_shots', type: DataType.INTEGER, allowNull: true })
  declare powerLongShots: number | null;

  @Column({ field: 'mentality_aggression', type: DataType.INTEGER, allowNull: true })
  declare mentalityAggression: number | null;

  @Column({ field: 'mentality_interceptions', type: DataType.INTEGER, allowNull: true })
  declare mentalityInterceptions: number | null;

  @Column({ field: 'mentality_positioning', type: DataType.INTEGER, allowNull: true })
  declare mentalityPositioning: number | null;

  @Column({ field: 'mentality_vision', type: DataType.INTEGER, allowNull: true })
  declare mentalityVision: number | null;

  @Column({ field: 'mentality_penalties', type: DataType.INTEGER, allowNull: true })
  declare mentalityPenalties: number | null;

  @Column({ field: 'mentality_composure', type: DataType.INTEGER, allowNull: true })
  declare mentalityComposure: number | null;

  @Column({ field: 'defending_marking', type: DataType.INTEGER, allowNull: true })
  declare defendingMarking: number | null;

  @Column({ field: 'defending_standing_tackle', type: DataType.INTEGER, allowNull: true })
  declare defendingStandingTackle: number | null;

  @Column({ field: 'defending_sliding_tackle', type: DataType.INTEGER, allowNull: true })
  declare defendingSlidingTackle: number | null;

  @Column({ field: 'goalkeeping_diving', type: DataType.INTEGER, allowNull: true })
  declare goalkeepingDiving: number | null;

  @Column({ field: 'goalkeeping_handling', type: DataType.INTEGER, allowNull: true })
  declare goalkeepingHandling: number | null;

  @Column({ field: 'goalkeeping_kicking', type: DataType.INTEGER, allowNull: true })
  declare goalkeepingKicking: number | null;

  @Column({ field: 'goalkeeping_positioning', type: DataType.INTEGER, allowNull: true })
  declare goalkeepingPositioning: number | null;

  @Column({ field: 'goalkeeping_reflexes', type: DataType.INTEGER, allowNull: true })
  declare goalkeepingReflexes: number | null;

  @Column({ field: 'goalkeeping_speed', type: DataType.INTEGER, allowNull: true })
  declare goalkeepingSpeed: number | null;

  @Column({ field: 'player_traits', type: DataType.STRING, allowNull: true })
  declare playerTraits: string | null;
}
